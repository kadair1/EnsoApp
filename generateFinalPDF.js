var markdownpdf = require("markdown-pdf")

async function generateFinalPDF(data) { 
  
  const md = `# Event Planning

  # Venue

  ## Venue Choice

  ${data.venue}

  ## Email to venue

  Use this email to contact the venue:

  ${data.bookingRequest} 
  `;


  markdownpdf().from.string(md).to(`./public/${data.id}.pdf`, function () {
    data.pdf = `${data.id}.pdf`;
  })
  
}


module.exports = generateFinalPDF;