// src/lib/csv.ts

export const exportBatchToCSV = (dataList: any[]) => {
  const clean = (str: string) =>
    str.replace(/\n/g, ' ').replace(/"/g, '""').trim();

  const headers = 'Filename,Title,Keywords,Category,Releases';
  const rows = dataList
    .map((item) => {
      const fName = clean(item.filename);
      const title = clean(item.title).substring(0, 200);
      const keywords = clean(item.keywords)
        .split(',')
        .map((k: string) => k.trim())
        .filter((k: string) => k !== '')
        .join(', ');
      const category = item.category || '3';
      const releases = clean(item.releases || '');
      return `"${fName}","${title}","${keywords}",${category},"${releases}"`;
    })
    .join('\n');

  const blob = new Blob(['\ufeff' + headers + '\n' + rows], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `adogen_batch_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};