// let invoice_setting_id;

// const getInvoiceSetting = async () => {
//   try {
//     const response = await fetch("/api/v1/setting/get-Invoice-setting", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (response.ok) {
//       // Handle successful login
//       const data = await response.json();

//       document.getElementById("top_inv_logo").innerHTML = `<img
//                               class="float-right"
//                               style="width: 250px; height: 150px;"
//                               src="${data.data.invoice_logo[0]}"
//                               alt=""
//                             />`;

//       document.getElementById("bottom_inv_logo").innerHTML = `<img
//                             class="text-opacity m-t-5"
//                             src="${data.data.invoice_logo[0]}"
//                           alt="Logo"  style="width: 100px;"
//                           />`;
//       document.getElementById("companyname").innerHTML = data.data.companyname;
//       document.getElementById("companyAddress").innerHTML =
//         data.data.companyAddress;
//       document.getElementById("stateCity").innerHTML = data.data.stateCity;
//       document.getElementById("GSTno").innerHTML = data.data.GSTno;
//       document.getElementById("companynumber").innerHTML =
//         data.data.companynumber;

//       document.getElementById("bottom_phone_no").innerHTML =
//         `<span class="font-weight-semibold text-dark"
//                                 >Phone:</span
//                               >` +
//         " " +
//         data.data.companynumber;

//       document.getElementById("bottom_email").innerHTML = data.data.companyname;
//     } else {
//       console.warn("erro");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// window.onload = getInvoiceSetting();
