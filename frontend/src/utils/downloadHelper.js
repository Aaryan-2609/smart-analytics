import axios from '../api/config';

export async function downloadFileById(fileId) {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/files/${fileId}/download`, {
    responseType: 'blob',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Try to infer filename from content-disposition; fallback to generic
  const disposition = response.headers['content-disposition'] || '';
  const fileNameMatch = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/);
  const fileName = decodeURIComponent((fileNameMatch && (fileNameMatch[1] || fileNameMatch[2])) || 'downloaded-file');
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadChart(chart) {
  try {
    // Generate chart data first
    const response = await axios.post(`/analysis/generate-charts/${chart.fileId._id}`, {
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      zAxis: chart.zAxis,
      chartType: chart.chartType
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const chartData = response.data.data;
    
    // Create a temporary chart container
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.height = '600px';
    tempDiv.style.backgroundColor = '#1a1a1a';
    document.body.appendChild(tempDiv);

    // Import Highcharts dynamically and initialize needed modules
    const HighchartsModule = await import('highcharts');
    const Highcharts = HighchartsModule.default || HighchartsModule;
    const is3D = !!(chart.chartType && chart.chartType.includes('3d'));
    if (is3D) {
      // Load 3D module only if needed
      try {
        const HC3DModule = await import('highcharts/highcharts-3d');
        const init3D = HC3DModule.default || HC3DModule;
        if (typeof init3D === 'function') init3D(Highcharts);
      } catch (_) {
        // ignore if 3D cannot be loaded; chart will render in 2D
      }
    }
    
    // Create chart options
    const is3DChart = is3D;
    const baseChartType = chart.chartType?.replace('3d-', '');
    
    const options = {
      chart: {
        backgroundColor: '#1a1a1a',
        type: baseChartType === 'donut' ? 'pie' : baseChartType,
        width: 800,
        height: 600,
        ...(is3DChart && {
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
            depth: baseChartType === 'column' ? 70 : 35
          }
        })
      },
      title: {
        text: `${chart.chartType?.toUpperCase()} Chart - ${chart.fileName}`,
        style: { color: '#ffffff' }
      },
      xAxis: {
        categories: chartData.categories,
        title: { text: chart.xAxis, style: { color: '#cccccc' } },
        labels: { style: { color: '#cccccc' } }
      },
      yAxis: {
        title: { text: chart.yAxis, style: { color: '#cccccc' } },
        labels: { style: { color: '#cccccc' } }
      },
      plotOptions: {
        ...(baseChartType === 'pie' && {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            ...(is3DChart && { depth: 35 }),
            ...(chart.chartType === '3d-donut' && { innerSize: 100 }),
            dataLabels: {
              enabled: true,
              style: { color: '#ffffff' }
            }
          }
        }),
        ...(baseChartType === 'column' && is3DChart && {
          column: {
            depth: 25,
            colorByPoint: true
          }
        })
      },
      series: [{
        name: `${chart.yAxis} vs ${chart.xAxis}`,
        data: chartData.seriesData,
        color: '#8b5cf6'
      }],
      credits: { enabled: false },
      legend: {
        itemStyle: { color: '#cccccc' }
      }
    };

    // Create the chart
    const chartInstance = Highcharts.chart(tempDiv, options);
    
    // Wait for chart to render, then extract SVG element directly
    setTimeout(async () => {
      try {
        const svgEl = tempDiv.querySelector('svg');
        if (!svgEl) throw new Error('SVG element not found');

        // Serialize SVG
        const serializer = new XMLSerializer();
        // Ensure namespaces exist for proper rendering in image
        if (!svgEl.getAttribute('xmlns')) svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        if (!svgEl.getAttribute('xmlns:xlink')) svgEl.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        const svgString = serializer.serializeToString(svgEl);

        // Attempt PNG generation first
        try {
          const canvas = document.createElement('canvas');
          const bbox = svgEl.viewBox && svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.width
            ? { w: svgEl.viewBox.baseVal.width, h: svgEl.viewBox.baseVal.height }
            : { w: 800, h: 600 };
          canvas.width = Math.ceil(bbox.w);
          canvas.height = Math.ceil(bbox.h);
          const ctx = canvas.getContext('2d');

          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `${chart.fileName}_${chart.chartType}_chart.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
          };
          img.onerror = () => {
            throw new Error('PNG render failed');
          };
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          img.src = url;

          // Revoke URL and cleanup after a brief delay
          setTimeout(() => {
            URL.revokeObjectURL(url);
            if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
            if (chartInstance && typeof chartInstance.destroy === 'function') chartInstance.destroy();
          }, 750);
        } catch (pngErr) {
          // Fallback to SVG download
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${chart.fileName}_${chart.chartType}_chart.svg`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
          if (chartInstance && typeof chartInstance.destroy === 'function') chartInstance.destroy();
        }
      } catch (error) {
        console.error('Error downloading chart:', error);
        if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
        if (chartInstance && typeof chartInstance.destroy === 'function') chartInstance.destroy();
        alert('Failed to download chart. Please try again.');
      }
    }, 600);
    
  } catch (error) {
    console.error('Error downloading chart:', error);
    alert('Failed to download chart. Please try again.');
  }
}


