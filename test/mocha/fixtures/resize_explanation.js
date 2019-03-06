module.exports = {
  onlyText: {
    description: 'Simple Text',
    input:  'Lorem ipsum dolor sit amet, consectetur adipiscin. Quisque varius pretium mauris in ornare. Cras augue.'
  },

  singlePTag: {
    description: 'Single paragraph',
    input: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at ante risus. Nam id sollicitudin dolor. Phasellus velit ipsum, consequat in faucibus.</p>'
  },

  pWithFmt:{
    description: 'Formatted paragraph',
    input: `<p><u>Hello</u></p><p><br></p><p><strong><u>Maybe</u></strong></p>`
  },

  smallGif:{
    description: 'Small gif',
    input:  `<p class='ql-align-justify'><img src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'></p><p><br></p>`
  },
  smallGifText: {
    description: 'Small gif inbetween text',
    input: `<p><u>Hello</u></p><p><br></p><p><img src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'></p><p><br></p><p><strong><u>Maybe</u></strong></p>`
  }
};