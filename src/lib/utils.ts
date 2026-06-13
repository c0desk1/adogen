import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const resizeImage = (file: File, maxWidth = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateImageSize = (file: File, maxSizeMB = 10): boolean => {
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

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

const CDN_ORIGIN = 'https://cdn.c0desk1.my.id';

export function isCdnUrl(src: string): boolean {
  return typeof src === 'string' && src.startsWith(CDN_ORIGIN);
}

export function cdnImage(
  src: string,
  options?: {
    w?: number;
    h?: number;
    q?: number;
    f?: 'webp' | 'avif' | 'jpeg' | 'auto';
  }
): string {
  if (!isCdnUrl(src)) return src;
  const url = new URL(src);
  if (options?.w) url.searchParams.set('w', String(options.w));
  if (options?.h) url.searchParams.set('h', String(options.h));
  url.searchParams.set('q', String(options?.q ?? 85));
  url.searchParams.set('f', options?.f ?? 'auto');
  return url.toString();
}