import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { format } from 'date-fns';

/**
 *  <SubmissionGroup
      @canRespond={{this.canRespond}}
      @submissions={{this.currentWorkspace.submissions.content}}
      @submission={{this.model.submission}}
      @addSelection={{this.addSelection}}
      @deleteSelection={{this.deleteSelection}}
      @currentWorkspace={{this.currentWorkspace}}
      @selections={{this.nonTrashedSelections}}
      @responses={{this.nonTrashedResponses}}
      @containerLayoutClass={{this.containerLayoutClass}}
      @canSeeSelections={{this.canSeeSelections}}
      @isParentWorkspace={{this.isParentWorkspace}}
    />
 */
export default class SubmissionGroupComponent extends Component {
  @service('utility-methods') utils;
  @service navigation;

  @tracked isHidden = false;
  @tracked showStudents = false;
  @tracked switching = false;
  @tracked isNavMultiLine = false;
  @tracked ownHeight;

  get currentStudent() {
    return this.args.submission?.student;
  }

  get currentStudentDisplayName() {
    return this.args.submission?.studentDisplayName;
  }

  get studentWork() {
    const submissions = this.args.submissions ?? [];
    const threads = {};

    // Get unique student IDs, then sort them
    const students = [...new Set(submissions.map((sub) => sub.student))].sort(
      (a, b) => a.localeCompare(b)
    );

    // Group submissions by student
    students.forEach((student) => {
      threads[student] = submissions
        .filter((sub) => sub.student === student)
        .sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
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
    return this.studentWork[this.args.submission?.student] ?? [];
  }

  get currentRevisions() {
    const thread = this.currentThread ?? [];
    return thread.map((submission, index, all) => {
      const createDate = new Date(submission.createDate);
      const datePart = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(createDate);
      const timePart = format(createDate, 'h:mm');
      return {
        index: index + 1,
        label: `${datePart} ${timePart}`,
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
    if (!currentThread?.length) {
      return undefined;
    }

    // If we're in a multi-revision thread and not at the latest, go to next revision
    const threadHead = currentThread.at(-1);
    if (currentThread.length > 1 && this.args.submission !== threadHead) {
      const index = currentThread.indexOf(this.args.submission);
      return currentThread[index + 1];
    }

    // Otherwise, go to previous student's latest submission (with wraparound)
    const currentIndex = this.submissionThreadHeads.indexOf(threadHead);
    const prevIndex =
      currentIndex === 0
        ? this.submissionThreadHeads.length - 1
        : currentIndex - 1;
    return this.submissionThreadHeads[prevIndex];
  }

  get nextThread() {
    const currentThread = this.currentThread;
    if (!currentThread?.length) {
      return undefined;
    }

    // If we're in a multi-revision thread and not at the first, go to previous revision
    if (currentThread.length > 1 && this.args.submission !== currentThread[0]) {
      const index = currentThread.indexOf(this.args.submission);
      return currentThread[index - 1];
    }

    // Otherwise, go to next student's latest submission (with wraparound)
    const threadHead = currentThread.at(-1);
    const currentIndex = this.submissionThreadHeads.indexOf(threadHead);
    const nextIndex =
      currentIndex === this.submissionThreadHeads.length - 1
        ? 0
        : currentIndex + 1;
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
  setCurrentSubmission(currentRevision) {
    if (currentRevision?.revision) {
      this.navigation.toSubmission(
        currentRevision.revision.id,
        this.args.currentWorkspace?.id
      );
    }
  }

  @action
  onStudentSelect(submissionId) {
    const match = this.submissionThreadHeads.find((s) => s.id === submissionId);
    if (match) {
      this.navigation.toSubmission(match.id, this.args.currentWorkspace?.id);
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
