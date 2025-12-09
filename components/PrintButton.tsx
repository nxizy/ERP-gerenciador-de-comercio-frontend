interface PrintButtonProps{
    label?: string
    data: any
}

export function PrintButton({ label, data }: PrintButtonProps) {
  function handlePrint() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: monospace; /* Fica ótimo na matricial */
              padding: 20px;
              font-size: 14px;
            }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .item { margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <div class="title">Ficha do Cliente</div>

          <div class="item"><b>Nome:</b> ${data.name}</div>
          <div class="item"><b>Contato:</b> ${data.contact}</div>
          <div class="item"><b>Endereço:</b> ${data.address}</div>
          <div class="item"><b>Observação:</b> ${data.obs}</div>

          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  return (
    <button
      onClick={handlePrint}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {label}
    </button>
  );
}
