async function categoryList() {
  try {
    let loadingDiv = showLoading();

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
    // Make an API call to get-category (replace with your actual API endpoint)
    const response = await fetch("/api/v1/category/get-category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    hideLoading(loadingDiv);

    if (response.ok) {
      // Handle successful login
      const data = await response.json();

      console.log(data);

      if (data.data.length === 0) {
        return (document.getElementById(
          "display-category-list"
        ).innerHTML = `<tr>
                       <td>
                       No data available.
                       </td>

                       </tr>`);
      }

      let res = data.data
        .map((item, index) => {
          return `<tr>
                   <td>
                   #${index + 1}
                   </td>
                   <td>${item.category_name}</td>
                   <td >
                   <button class="btn btn-icon btn-hover btn-sm btn-rounded pull-right">
                   <i class="anticon anticon-edit" data-toggle="modal"
                       data-target="#edit-category" onClick="getCategoryDetails('${
                         item._id
                       }')"></i>
                   </button>
                   <button class="btn btn-icon btn-hover btn-sm btn-rounded" onClick="deleteCategory('${
                     item._id
                   }')">
                   <i class="anticon anticon-delete"></i>
                   </button>
                   </td>
                   </tr>`;
        })
        .join("");

      document.getElementById("display-category-list").innerHTML = res;
    } else {
      alert("erro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call categoryList when the page loads
window.onload = categoryList;

async function deleteCategory(id) {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];

    const response = await swal({
      title: "Are you sure you want to delete?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (response) {
      if (response) {
        const deleteResponse = await fetch(
          `/api/v1/category/delete-category/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle successful deletion
        const data = await deleteResponse.json();

        if (deleteResponse.ok) {
          swal({
            title: "Deleted!",
            text: `${data.message}`,
            icon: "success",
          }).then(() => {
            categoryList();
          });
        } else {
          // Handle deletion error
          swal("Error", `${data.message}`, "error");
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

let category_id;
async function getCategoryDetails(id) {
  try {
    category_id = id;
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];

    const response = await fetch(
      `/api/v1/category/get-or-update-category/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_type: "getCategory",
        }),
      }
    );

    if (response.ok) {
      // Handle successful login
      const data = await response.json();
      console.log(data);
      document.getElementById("category_name").value = data.data.category_name;
    } else {
      // Handle login error
      swal("Error", "Failed to get the category.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function postData() {
  // const userName = form.userName.value
  const category_name = document.getElementById("category_name").value.trim();
  // Make the API call to login
  const response = await fetch(
    `/api/v1/category/get-or-update-category/${category_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_type: "updated",
        category_name,
      }),
    }
  );

  if (response.ok) {
    // Handle successful login
    const data = await response.json();

    swal({
      title: "Updated!",
      text: `${data.message}`,
      icon: "success",
    }).then(() => {
      // Automatically trigger the "Close" button click event to close the modal
      document.getElementById("closeModalButton").click();
      categoryList();
    });
  } else {
    // Handle failed registration
    const errorData = await response.json();
    console.log(errorData);
    errorMessage.textContent = errorData.message;
  }
}
