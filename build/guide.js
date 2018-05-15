guiders.createGuider({
  buttons: [],
  description: "Now that you have chosen a selection you can add comments.  Select one of the comment types: Notice, Wonder, Feedback and type a comment.",
  id: "comments",
  next: "comments.comment",
  attachTo: "#al_right", //really wanted to attach to this but not working
  overlay: true,
  highlight: "#al_right",
  position: 12,
  title: "Commenting on a Selection"
});

guiders.createGuider({
  buttons: [{name: "Next"},{name: "Close"}],
  description: "Your workspace is a place where you can browse, organize, and comment on submissions.  Let's get started.",
  id: "workspace",
  next: "submissions",
  overlay: true,
  title: "Welcome to your Workspace!"
});

guiders.createGuider({
  buttons: [],
  description: "Click the 'Make selection' button to begin making a selection. Then highlight the part of the submission you want to select. <strong>Go ahead and make a selection now.</strong>",
  id: "submissions.selection",
  next: "submissions.selections",
  attachTo: "#al_center",
  overlay: true,
  width: '200px',
  highlight: "#al_center",
  position: 9,
  title: "Make Selection"
});
guiders.createGuider({
  buttons: [{name: "Next"}],
  description: "You can organize your selections by filing them in folders.  Folders contain other folders and can be expanded by clicking on the folder icon.  You can reorganize folders by dragging them into sub-folders.  You can also add and delete folders using the buttons at the bottom.",
  id: "folders",
  next: "folders.counts",
  attachTo: "#al_left",
  overlay: true,
  highlight: "#al_left",
  position: 2,
  title: "Organizing Selections"
});
guiders.createGuider({
  buttons: [{name: "Done!", onclick: function(){$('#doneTour').click()}}],
  id: "done",
  title: "Done!",
  overlay: true,
  highlight: "#takeTour",
  position: 9,
  attachTo: "#takeTour",
  description: "You're all done.  If you want to re-take the tour, just hit this button."
});
guiders.createGuider({
  buttons: [{name: "Next"}],
  description: "To file a selection, drag it to a folder.",
  id: "fileSelection",
  next: "done",
  title: "File Selections in Folders"
});
guiders.createGuider({
  buttons: [{name: "Next"}],
  description: "The count shows how many distinct submissions (left) and selections (right) have been filed in this folder (including all of the sub-folders).",
  id: "folders.counts",
  next: "fileSelection",
  attachTo: "#al_folders>li.folderItem:eq(2) aside",
  overlay: true,
  highlight: "#al_folders>li.folderItem:eq(2) aside",
  position: 12,
  title: "Folder Counts"
});
guiders.createGuider({
  buttons: [{name: "Next"},{name: "Close"}],
  description: "Here is the short and long answer of the submission",
  id: "submissions.text",
  next: "submissions.selection",
  attachTo: "#al_submission>.short",
  overlay: true,
  width: '200px',
  highlight: "#al_submission>.submission",
  position: 9,
  title: "Submission Text"
});

guiders.createGuider({
  buttons: [{name: "Next"},{name: "Close"}],
  description: "You can navigate between submissions using the dropdown or the arrows.",
  id: "submissions.nav",
  next: "submissions.text",
  attachTo: "#al_center>header",
  overlay: true,
  width: '200px',
  highlight: "#al_center>header",
  position: 9,
  title: "Submission Navigation"
});
guiders.createGuider({
  buttons: [{name: "Next"}, {name: "Close"}],
  description: "Your submissions show up here.",
  id: "submissions",
  next: "submissions.nav",
  attachTo: "#al_center",
  position: 12,
  overlay: true,
  highlight: "#al_center",
  title: "Submissions Area"
});

guiders.createGuider({
  buttons: [],
  description: "Now that you have chosen a selection you can add comments.  Select one of the comment types: Notice, Wonder, Feedback and type a comment.",
  id: "comments",
  next: "comments.comment",
  attachTo: "#al_right", //really wanted to attach to this but not working
  overlay: true,
  highlight: "#al_right",
  position: 12,
  title: "Commenting on a Selection"
});

guiders.createGuider({
  buttons: [],
  description: "Great! Now click on your selection and let's see what we can do with it.",
  id: "submissions.selections",
  next: "comments",
  attachTo: "#submission_selections", //really wanted to attach to this but not working
  overlay: true,
  width: '200px',
  highlight: "#al_center",
  position: 9,
  title: "You've made a selection!"
});
guiders.createGuider({
  buttons: [{name: "Next"}],
  description: "The most relevant comments show up at the top and have a darker highlighting.  You can check the box next to the comment to indicate you want to include this comment in your reply.  You'll notice that if there are comments selected you will have another button next to 'Make Selection' called 'Draft Reply'.",
  id: "comments.comment",
  next: "folders",
  attachTo: "#al_feedback_display",
  overlay: true,
  highlight: "#al_feedback_display",
  position: 9,
  title: "Your comments show up here."
});
