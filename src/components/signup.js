const R = require('ramda');
const { h, render, Component, Indent } = require('ink');
const autoBind = require('react-autobind');
const TextInput = require('ink-text-input');
const PasswordInput = require('ink-password-input');
const actions = require('../actions');

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        email: '',
        password: '',
        password_confirmation: '',
      },
      step: 0,
    }
    autoBind(this);
  }

  onChangeEmail(email) {
    const user = { email } >> R.merge(this.state.user);
    this.setState({ user: user });
  }

  onChangePassword(password) {
    const user = { password } >> R.merge(this.state.user);
    this.setState({ user: user });
  }

  onChangePasswordConfirmation(password_confirmation) {
    const user = { password_confirmation } >> R.merge(this.state.user);
    this.setState({ user: user });
  }

  onSubmit() {
    const { user } = this.state;
    const _ = { user } >> actions.tryUserSignup >> this.props.dispatch;
  }

  incrementStep() {
    this.setState({ step: this.state.step + 1 });
  }

  render(_, state) {
    switch (state.step) {
      case 0:
        return (
          <div>
            Enter your email:
            <span> </span>
            <TextInput
              value={state.user.email}
              onChange={this.onChangeEmail}
              onSubmit={this.incrementStep}
            />
          </div>
        );
      case 1:
        return (
          <div>
            Enter your password:
            <span> </span>
            <PasswordInput
              value={state.user.password}
              placeholder="-------------------"
              onChange={this.onChangePassword}
              onSubmit={this.incrementStep}
            />
          </div>
        )
      case 2:
        return (
          <div>
            Enter your password (confirmation):
            <span> </span>
            <PasswordInput
              value={state.user.password_confirmation}
              placeholder="----------"
              onChange={this.onChangePasswordConfirmation}
              onSubmit={this.onSubmit}
            />
          </div>
        )
      default:
        return null;
    }
  }
}

module.exports = Signup;
