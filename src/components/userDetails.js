import React, { Component } from "react";

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
    };
  }
  componentDidMount() {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        this.setState({ userData: data.data });
      });
  }
logOut = () => {
  window.localStorage.clear();
  window.location.href = "./sign-in";
}

  render() {
    return (
      
      <div>
         <h2>User Details</h2>
        <div className="userdetail">
          Name :<h5 className="ms-3">{this.state.userData.fname}</h5>
        </div>
        <div className="userdetail mt-2">

          Email : <h5 className="ms-3">{this.state.userData.email}</h5>
        </div>
          <button onClick={this.logOut} className="btn btn-primary mt-3">
              Log Out
            </button>
        
      </div>
    );
  }
}
