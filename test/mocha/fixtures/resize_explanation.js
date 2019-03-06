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
  },
  multiplebrTags: {
    description: 'Style attribute',
    input: `<p>(Work shown below)</p><p><br></p><p><span style='background-color: transparent;'>I began by trying to find patterns. The first pattern I found was that all the prime numbers would only be touched once. They would be opened by the person with locker #1 and closed by the person with the prime #. I then created a list of all the prime numbers to start to eliminate possibilities. From there, I started to write down the remaining numbers (4, 6, 8, 9, 10, 12, 14, 16, …) and also writing each of the numbers that are factors of the remaining numbers. Quite quickly, I noticed a pattern. The pattern I noticed was that only the numbers whose square root was a whole number resulted in the locker being opened. This is how I answered the first question.</span></p>`

  },
  consecutiveBreals: {
    description: 'Consecutive br tags',
    input: `<p><br><br></p>`
  }
};