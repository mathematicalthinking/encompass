import UserSignupComponent from './user-signup';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class SignUpComponent extends UserSignupComponent {
  // services
  @service('sweet-alert') alert;
  @service errorHandling;
  @service navigation;
  @service('string-similarity') similarity;

  // local state
  @tracked missingCredentials = false;
  @tracked noTermsAndConditions = false;
  @tracked agreedToTerms = false;

  @tracked firstName = '';
  @tracked lastName = '';
  @tracked org = null;           // selected org record
  @tracked orgRequest = null;    // string request when creating new org
  @tracked location = '';
  @tracked requestReason = '';

  didConfirmOrgRequest = false;

  // ----- derived -----
  get orgId() {
    return this.org?.id ?? null;
  }

  get orgOptions() {
    // Map incoming org models to {id, name}
    const orgs = this.args.organizations;
    if (!orgs) return [];

    // DS.ManyArray supports toArray()
    const list = (typeof orgs.toArray === 'function') ? orgs.toArray() : orgs;
    return list.map((org) => ({ id: org.id, name: org.get?.('name') ?? org.name }));
  }

  // Prevent creating an option if it exactly matches an existing org
  @action
  orgRequestFilter(orgRequest) {
    if (!orgRequest) return true;
    const orgs = this.args.organizations ?? [];
    const names = (typeof orgs.mapBy === 'function')
      ? orgs.mapBy('name')
      : (typeof orgs.toArray === 'function' ? orgs.toArray().map(o => o.get('name')) : orgs.map(o => o.name));
    const requestLower = orgRequest.trim().toLowerCase();
    return !names.some((n) => (n || '').toLowerCase() === requestLower);
  }

  // Similar-orgs finder (keeps your stopword/threshold logic)
  getSimilarOrgs(name) {
    const stopWords = ['university', 'college', 'school', 'the', 'and', 'of', 'for', ' '];
    const orgs = this.args.organizations;
    if (!orgs) return [];

    const list = (typeof orgs.toArray === 'function') ? orgs.toArray() : orgs;
    const requestCmp = this.similarity.convertStringForCompare(name, stopWords);

    return list.filter((org) => {
      const orgName = org.get?.('name') ?? org.name;
      const cmp = this.similarity.convertStringForCompare(orgName, stopWords);
      return this.similarity.compareTwoStrings(cmp, requestCmp) > 0.5;
    });
  }

  // Selectize create hook: either confirm new option or guide user to pick existing org.
  // NOTE: no jQuery/selectize imperative API — we control selection via @value and state.
  @action
  async processOrgRequest(input, callback) {
    const similar = this.getSimilarOrgs(input);
    const optionsMap = {};

    if (similar.length > 0) {
      similar.forEach((org) => {
        optionsMap[org.id] = org.get?.('name') ?? org.name;
      });
      optionsMap[input] = `Yes, I am sure I want to create ${input}`;

      const text = `Are you sure you want to submit a new organization request for ${input}? We found ${similar.length} organizations with similar names. Please review the options; if you proceed, admin approval is required.`;

      const result = await this.alert.showPromptSelect(
        'Similar Orgs Found',
        optionsMap,
        'Choose existing org or confirm request',
        text
      );

      // user cancelled
      if (!result?.value) {
        this.orgRequest = null;
        return callback?.(null);
      }

      // user confirmed new org creation
      if (result.value === input) {
        this.didConfirmOrgRequest = true;
        this.orgRequest = input;
        return callback?.({ id: input, name: input }); // allow selectize to create the option
      }

      // user picked an existing org by id
      const chosen = (typeof this.args.organizations.findBy === 'function')
        ? this.args.organizations.findBy('id', result.value)
        : (this.args.organizations || []).find((o) => o.id === result.value);

      if (chosen) {
        this.org = chosen;
        this.orgRequest = null;
      }
      return callback?.(null); // no new option
    }

    // no similar orgs, allow creation
    this.didConfirmOrgRequest = true;
    this.orgRequest = input;
    return callback?.({ id: input, name: input });
  }

  // Selectize add/remove hooks
  @action
  setOrg(val /*, item */) {
    if (!val) { this.org = null; return; }

    const found = (typeof this.args.organizations.findBy === 'function')
      ? this.args.organizations.findBy('id', val)
      : (this.args.organizations || []).find((o) => o.id === val);

    // If user typed in a custom value (orgRequest), keep org null and use orgRequest.
    if (!found && this.orgRequest === val) {
      this.org = null;
      return;
    }

    this.org = found ?? null;
  }

  // ----- form actions -----
  @action
  resetErrors() {
    // superclass reset + local flags
    super.resetErrors?.();
    this.missingCredentials = false;
    this.noTermsAndConditions = false;
    this.errorHandling.removeMessages('signupErrors');
  }

  @action
  onSubmit(e) {
    e.preventDefault();
    this.signup();
  }

  async createUser(data) {
    const body = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) body.append(k, String(v));
    });

    const res = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      credentials: 'same-origin',
      body
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json?.message || `Signup failed (${res.status})`;
      throw { message: msg, errors: json?.errors };
    }
    return json;
  }

  @action
  async signup() {
    this.resetErrors();

    const firstName = this.firstName?.trim();
    const lastName = this.lastName?.trim();
    const email = this.email?.trim();
    const confirmEmail = this.confirmEmail?.trim();
    const usernameTrim = this.username?.trim() ?? '';
    const password = this.password ?? '';
    const confirmPassword = this.confirmPassword ?? '';
    const location = this.location?.trim();
    const requestReason = this.requestReason?.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      (!this.org && !this.orgRequest) ||
      !location ||
      !usernameTrim ||
      !password ||
      !requestReason ||
      !confirmEmail ||
      !confirmPassword
    ) {
      this.missingCredentials = true;
      return;
    }

    if (!this.agreedToTerms) {
      this.noTermsAndConditions = true;
      return;
    }

    if (this.usernameError) {
      return;
    }

    if (!this.doPasswordsMatch || !this.doEmailsMatch) {
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      location,
      username: usernameTrim,
      password,
      requestReason,
      accountType: 'S'
    };

    // attach org or orgRequest
    if (this.orgRequest) {
      // if typed matches existing exactly, use that org id
      const match = (typeof this.args.organizations.findBy === 'function')
        ? this.args.organizations.findBy('name', this.orgRequest)
        : (this.args.organizations || []).find((o) => (o.get?.('name') ?? o.name) === this.orgRequest);

      if (match) {
        payload.organization = match.id;
      } else {
        payload.organizationRequest = this.orgRequest;
      }
    } else if (this.org) {
      payload.organization = this.org.id;
    }

    try {
      const res = await this.createUser(payload);

      // legacy messages compatibility
      if (res.username) {
        this.alert.showToast('success', 'Signup successful', 'bottom-end', 3000, null, false);
        this.navigation.goHome({ replace: true });
        return;
      }
      if (res.message === 'There already exists a user with that username') {
        this.usernameError = this.usernameErrors.taken;
        return;
      }
      if (res.message === 'There already exists a user with that email address') {
        this.emailError = this.emailErrors.taken;
        return;
      }

      // generic
      this.errorHandling.handleErrors(res, 'signupErrors');
    } catch (err) {
      this.errorHandling.handleErrors(err, 'signupErrors');
      this.errorHandling.displayErrorToast(err);
    }
  }
}
