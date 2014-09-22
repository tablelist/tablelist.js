angular
  .module('tl')
  .service('tl.invoice.service', ['tl.service', 'tl.invoice.resource',
    function(Service, Invoice) {

      var InvoiceService = Service.extend(Invoice);

      InvoiceService.prototype.readPdf = function(invoiceId) {
      	return Invoice.readPdf({
      		id : invoiceId
      	});
      };

      InvoiceService.prototype.createPdf = function(invoiceId) {
      	return Invoice.createPdf({
      		id : invoiceId
      	});
      };

      return new InvoiceService();
    }
  ]);
