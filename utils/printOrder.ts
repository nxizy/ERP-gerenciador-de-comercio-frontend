export function printOrder(order: any) {
  const printWindow = window.open("", "_blank");

  printWindow?.document.write(`
    <html>
      <head>
        <title>OS Nº ${order.id}</title>
        <style>
          @page { size: 240mm 139.7mm; margin: 5mm; }
          body { font-family: monospace; font-size: 12px; }
        </style>
      </head>
      <body>
        <h2>ORDEM DE SERVIÇO Nº ${order.id}</h2>
        Emitente: ${order}

        Cliente: ${order.clientName}<br>
        Telefone: ${order.phone}<br>
        Endereço: ${order.address}<br>
        -----------------------------<br>
        Itens: <br>
        ${order.items.map(i => `
          ${i.name} x${i.qty} - R$ ${(i.price * i.qty).toFixed(2)}<br>
        `).join("")}
        -----------------------------<br>
        Total: R$ ${order.total.toFixed(2)}<br>

        <script>window.print()</script>
      </body>
    </html>
  `);

  printWindow?.document.close();
}
