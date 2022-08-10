const enterSystem = async (name, email, password, passwordConfirm, phone) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/users/signin",
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        phone,
      },
    });
    console.log(res);

    if (res.status === 201) {
      alert(
        "We have send verification link to your Email.Please get into website through this link.Thank you for understanding."
      );
      window.setTimeout(() => {
        location.assign("/verify");
      }, 100);
    }
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

document.querySelector(".btnSignUp").addEventListener("click", function (e) {
  console.log(3);
  e.preventDefault();
  const name = document.querySelector(".username1").value;
  const email = document.querySelector(".email1").value;
  const password = document.querySelector(".password1").value;
  const passwordConfirm = document.querySelector(".passwordConfirm1").value;
  const number = document.querySelector(".phone").value;

  enterSystem(name, email, password, passwordConfirm, number);
});
