module.exports = {
  problems: [
    {
      keys: {
        title: 'text',
        text: 'text',
        additionalInfo: 'text',
        status: 'text',
        flagReason: 'text',
        copyrightNotice: 'text',
        sharingAuth: 'text',
        author: 'text'
      },
      options: {
        weights: {
          additionalInfo: 50,
          author: 75,
          copyrightNotice: 1,
          flagReason: 20,
          sharingAuth: 1,
          status: 10,
          text: 100,
          title: 300
        },
        name: 'textSearch'
      }
    }
  ],
  comments: [
    {
      keys: {
        label: 'text',
        text: 'text'
      },
      options: {
        weights: {
          label: 1,
          text: 10
        },
        name: 'textSearchComments'
      }
    }
  ],
  categories: [
    {
      keys: {
        description: 'text',
        identifier: 'text',
        url: 'text'
      },
      options: {
        weights: {
          url: 1,
          identifier: 3,
          description: 2
        },
        name: 'textSearch'
      }
    }
  ]
};
