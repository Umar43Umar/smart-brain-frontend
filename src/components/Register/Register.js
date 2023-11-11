import React from 'react';

class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
			name: ''
		}
	}
	onNameChange = (event) => {
		this.setState({name: event.target.value})
	}
	onEmailChange = (event) => {
		this.setState({email: event.target.value})
	}
	onPasswordChange = (event) => {
		this.setState({password: event.target.value})
	}
	onSubmitSignIn = () => {
	  const { email, password, name } = this.state;

	  // Validate input fields
	  if (!email || !password || !name) {
	    console.error("All fields are required");
	    return; // Return early if any required field is empty
	  }

	  fetch('https://myserver-s5pd.onrender.com/register', {
	    method: 'post',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      email: email,
	      password: password,
	      name: name,
	    })
	  })
	    .then(response => {
	      if (response.ok) {
	        return response.json(); // Parse the response if it's successful
	      } else {
	        throw new Error("Registration failed"); // Handle non-200 status codes
	      }
	    })
	    .then(user => {
	      if (user.id) {
	        this.props.loadUser(user);
	        this.props.onRouteChange('home');
	      } else {
	        throw new Error("Invalid response from the server");
	      }
	    })
	    .catch(error => {
	      console.log('Error:', error);
	    });
	}

	render(){
		return(
			<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center">
				<main className="pa4 black-80">
		  			<div className="measure">
		    			<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
		      				<legend className="f1 fw6 ph0 mh0">Register</legend>
		      				<div className="mt3">
		        				<label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
		        				<input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" onChange={this.onNameChange}/>
		      				</div>
		      				<div className="mt3">
		        				<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
		        				<input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" onChange={this.onEmailChange}/>
		      				</div>
		      				<div className="mv3">
		        				<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
		        				<input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onChange={this.onPasswordChange}/>
		      				</div>
		    			</fieldset>
		    			<div className="">
		      				<input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
		    			</div>
		  			</div>
				</main>
			</article>	
		);
	}
}

export default Register;