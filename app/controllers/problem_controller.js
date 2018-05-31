/**
 * # Workspaces New Controller
 * @description This controller for creating a new workspace
 * @author Damola Mabogunje <damola@mathforum.org>
 * @since 1.0.1
 */

Encompass.ProblemController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
    canEdit: Ember.computed.not('currentUser.isAdmin'),
    teacher: Ember.computed.oneWay('currentUser.username'),

    actions: {
        radioSelect: function (value) {
            this.set('isPublic', value);
        },

        createProblem: function () {
            var controller = this;
            var createProblemData = { /*jshint camelcase: false */
                title: this.get('title'),
                text: this.get('text'),
                categories: this.get('categories'),
                additionalInfo: this.get('additionalInfo'),
                isPublic: this.get('isPublic'),
            };
            console.log(createProblemData);

            var request = this.store.createRecord('problem', createProblemData);
            var output;

            request.save().then(function (obj) {
                var result = obj.get('results');
                console.log('it worked!');
                console.log(result);
                //var output = "Imported %@1 submissions!".fmt(result.imported);
                var output = `Problem name: ${result}!`;

                if (result.updatedExisting) {
                    output += "\nYou have workspace(s) for these!";
                }

                if (window.confirm(output)) {
                    if (result.imported > 0) {
                        window.location.reload();
                    }
                }
            });
        }
    }
});
