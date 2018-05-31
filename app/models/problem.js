Encompass.Problem = DS.Model.extend(Encompass.Auditable, {
    problemId: Ember.computed.alias('id'),
    createdBy: DS.attr('string', { defaultValue: user.id}),
    createDate: DS.attr('date', { 
        defaultValue() { return new Date(); }}),
    isTrashed: DS.attr('boolean', { defaultValue: false }),
    title: DS.attr('string'),
    puzzleId: DS.attr('number'),
    text: DS.attr('string'),
    image: DS.attr('string'),
    sourceUrl: DS.attr('string'),
    additionalInfo: DS.attr('string'),
    isPublic: DS.attr('boolean', { defaultValue: false }),
    categories: DS.attr('array'),


    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    categories: [{
        type: ObjectId,
        ref: 'Category'
    }]
}



    folders: function () {
        var folders = [];
        this.get('selections').forEach(function (selection) {
            folders.pushObjects(selection.get('folders'));
        });
        return folders.uniq();
    }.property('selections.[].folders'),

    selectedComments: function () {
        return this.get('comments').filterBy('useForResponse', true);
    }.property('comments.[].useForResponse'),

    puzzle: function () {
        return this.get('publication.puzzle');
    }.property(),

    puzzleUrl: function () {
        return '/library/go.html?destination=' + this.get('puzzle.puzzleId');
    }.property(),

    /*
    attachment: function(){
      return this.get('data.uploadedFile');
    }.property(),
    */

    imageUrl: function () {
        return 'http://mathforum.org/encpows/uploaded-images/' + this.get('attachment.savedFileName');
    }.property(),

    student: function () {
        var student = this.get('creator.safeName');
        return student;
    }.property('creator.safeName'),

    label: function () {
        var label = this.get('student');
        var createDate = this.get('createDate');
        if (createDate) {
            label += ' on ' + moment(createDate).format('l');
        }
        label += ' (' + this.get('data.thread.threadId') + ')';
        return label;
    }.property('student', 'createDate', 'data.thread.threadId'),

    isStatic: function () {
        return !this.get('powId');
    }.property('powId')
});
