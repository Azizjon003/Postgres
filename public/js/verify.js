const codes = document.querySelectorAll(".code");

codes[0].focus();

codes.forEach((code, idx) => {
  code.addEventListener("keydown", (e) => {
    if (e.key >= 0 && e.key <= 9) {
      codes[idx].value = "";
      setTimeout(() => codes[idx + 1].focus(), 10);
    } else if (e.key === "Backspace") {
      setTimeout(() => codes[idx - 1].focus(), 10);
    }
  });
});

const sendFile = async (code, cookie) => {
  try {
    const res = await axios.patch(
      "http://localhost:8000/api/v1/users/verifyphone",
      {
        code: code,
      },
      {
        withCredentials: true,
        headers: {
          cookie: cookie,
        },
      }
    );
    console.log(res);

    if (res.status === 200) {
      alert(
        "We have send verification link to your Email.Please get into website through this link.Thank you for understanding."
      );
      window.setTimeout(() => {
        location.assign("/user");
      }, 100);
    }
  } catch (err) {
    console.log(err);
    alert("Invalid code");
  }
};

document.querySelector(".btn").addEventListener("click", function (e) {
  const one = document.querySelector("#one").value;
  const two = document.querySelector("#two").value;
  const three = document.querySelector("#three").value;
  const four = document.querySelector("#four").value;
  const five = document.querySelector("#five").value;
  const natija = one + two + three + four + five;
  console.log(natija);
  console.log(document.cookie);
  sendFile(natija, document.cookie);
});
