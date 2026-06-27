function escapePdfText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function downloadResumePdf() {
  const lines = [
    'Kumarasooriyar Paviththiran',
    'Data Science Undergraduate | Full Stack Developer',
    'Email: ppaviththiran815@gmail.com',
    'GitHub: github.com/Paviththiran.K',
    'LinkedIn: linkedin.com/in/paviththiran-kumarasooriyar',
    'Focus: AI, Machine Learning, Full Stack Development',
  ];

  const contentStream = [
    'BT',
    '/F1 22 Tf',
    '72 740 Td',
    `(${escapePdfText(lines[0])}) Tj`,
    '/F1 12 Tf',
    '0 -28 Td',
    `(${escapePdfText(lines[1])}) Tj`,
    '0 -26 Td',
    `(${escapePdfText(lines[2])}) Tj`,
    '0 -20 Td',
    `(${escapePdfText(lines[3])}) Tj`,
    '0 -20 Td',
    `(${escapePdfText(lines[4])}) Tj`,
    '0 -20 Td',
    `(${escapePdfText(lines[5])}) Tj`,
    'ET',
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${new TextEncoder().encode(contentStream).length} >>\nstream\n${contentStream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = ['0000000000 65535 f \n'];

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(`${String(new TextEncoder().encode(pdf).length).padStart(10, '0')} 00000 n \n`);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const startXref = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n${offsets.join('')}`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Kumarasooriyar_Paviththiran_Resume.pdf';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
