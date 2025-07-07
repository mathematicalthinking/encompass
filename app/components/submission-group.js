import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import moment from 'moment';

/**
 * Passed in by template:
 * - submissions
 * - submission
 * - canSelect - only used to pass on to submissions
 * - currentUser - only used to pass on to submissions
 * - currentWorkspace - only used to pass on to submissions
 */
export default class SubmissionGroupComponent extends Component {
  @service('utility-methods') utils;
  @service currentUrl;

  @tracked isHidden = false;
  @tracked showStudents = false;
  @tracked switching = false;
  @tracked isNavMultiLine = false;
  @tracked ownHeight;

  constructor() {
    super(...arguments);
    this.onNavResize = this.handleNavHeight.bind(this);
    this.currentUrl.setCurrentUrl(window.location.href);
  }

  get currentStudent() {
    return this.args.submission?.student;
  }

  get currentStudentDisplayName() {
    return this.args.submission?.studentDisplayName;
  }

  get studentWork() {
    const submissions = this.args.submissions ?? [];
    const threads = {};

    submissions
      .slice()
      .sortBy('student')
      .mapBy('student')
      .uniq()
      .forEach((student) => {
        if (!threads[student]) {
          threads[student] = submissions
            .filterBy('student', student)
            .sortBy('createDate');
        }
      });

    return threads;
  }

  get submissionThreadHeads() {
    return Object.values(this.studentWork).map((thread) => thread.at(-1));
  }

  get firstThread() {
    return this.submissionThreadHeads[0];
  }

  get lastThread() {
    return this.submissionThreadHeads.at(-1);
  }

  get currentThread() {
    return this.studentWork[this.currentStudent];
  }

  get currentRevisions() {
    const thread = this.currentThread ?? [];
    return thread.map((submission, index, all) => {
      return {
        index: index + 1,
        label: moment(submission.createDate).format('l h:mm'),
        revision: submission,
        thread: all.at(-1),
      };
    });
  }

  get currentRevisionIndex() {
    const revisions = this.currentRevisions;
    const currentId = this.args.submission?.id;
    const match = revisions.find((rev) => rev.revision.id === currentId);
    return match?.index ?? 0;
  }

  get currentRevision() {
    return this.currentRevisions[this.currentRevisionIndex - 1];
  }

  get sortedSubmissions() {
    return (this.args.submissions ?? []).slice().sort((a, b) => {
      if (a.student < b.student) return -1;
      if (a.student > b.student) return 1;
      return b.createDate - a.createDate;
    });
  }

  get currentSubmissionIndex() {
    return this.sortedSubmissions.indexOf(this.args.submission) + 1;
  }

  get mentoredRevisions() {
    const responses = this.args.responses ?? [];
    return this.currentRevisions.filter((rev) => {
      const sub = rev.revision;
      const responseIds = this.utils.getHasManyIds(sub, 'responses');
      return responses.some((r) => responseIds.includes(r.id));
    });
  }

  get studentSelectOptions() {
    return this.submissionThreadHeads.map((sub) => ({
      name: sub.studentDisplayName,
      id: sub.id,
    }));
  }

  get initialStudentItem() {
    const student = this.args.submission?.student;
    const head = this.submissionThreadHeads.find((s) => s.student === student);
    return head ? [head.id] : [];
  }

  get prevThread() {
    const currentThread = this.currentThread;
    const index = currentThread.indexOf(this.args.submission);
    if (
      currentThread.length > 1 &&
      !isEqual(this.args.submission, currentThread.at(-1))
    ) {
      return currentThread[index + 1];
    }
    const thread = currentThread.at(-1);
    if (thread === this.firstThread) {
      return this.lastThread;
    }
    const prevIndex = this.submissionThreadHeads.indexOf(thread) - 1;
    return this.submissionThreadHeads[prevIndex];
  }

  get nextThread() {
    const currentThread = this.currentThread;
    const index = currentThread.indexOf(this.args.submission);
    if (
      currentThread.length > 1 &&
      !isEqual(this.args.submission, currentThread[0])
    ) {
      return currentThread[index - 1];
    }
    const thread = currentThread.at(-1);
    if (thread === this.lastThread) {
      return this.firstThread;
    }
    const nextIndex = this.submissionThreadHeads.indexOf(thread) + 1;
    return this.submissionThreadHeads[nextIndex];
  }

  get isFirstChild() {
    return this.args.containerLayoutClass === 'hsc';
  }

  get isLastChild() {
    return this.args.containerLayoutClass === 'fsh';
  }

  get isOnlyChild() {
    return this.args.containerLayoutClass === 'hsh';
  }

  get isBipaneled() {
    return this.isFirstChild || this.isLastChild;
  }

  get isTripaneled() {
    return this.args.containerLayoutClass === 'fsc';
  }

  get revisionsToolTip() {
    return 'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)';
  }

  @action
  toggleStudentList() {
    this.showStudents = !this.showStudents;
  }

  @action
  addSelection(selection, isUpdateOnly) {
    this.args.addSelection?.(selection, isUpdateOnly);
  }

  @action
  deleteSelection(selection) {
    this.args.deleteSelection?.(selection);
  }

  @action
  toNewResponse(subId, wsId) {
    this.args.toNewResponse?.(subId, wsId);
  }

  @action
  setCurrentSubmission(currentRevision) {
    if (currentRevision?.revision) {
      this.args.toSubmission?.(currentRevision.revision.id);
    }
  }

  @action
  onStudentSelect(submissionId) {
    const match = this.submissionThreadHeads.find((s) => s.id === submissionId);
    if (match) {
      this.args.toSubmission?.(match.id);
    }
  }

  @action
  onStudentBlur() {
    const select = document.getElementById('student-select');
    if (!select || !select.selectize) return;

    const currentValue = select.selectize.getValue();
    const expectedValue = this.initialStudentItem[0];
    if (currentValue !== expectedValue) {
      select.selectize.setValue([expectedValue], true);
    }
  }

  @action
  handleNavHeight() {
    const nav = document.getElementById('submission-nav');
    const height = nav?.offsetHeight ?? 0;
    const isNowMultiLine = height > 52;

    if (isNowMultiLine !== this.isNavMultiLine) {
      this.isNavMultiLine = isNowMultiLine;
    }

    this.ownHeight = document.body.offsetHeight; // or another specific element
  }
}
