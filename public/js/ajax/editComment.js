function editComment(element) {
    // Textarea:
    const editArea = document.getElementById("edit-msg-" + element.id);
    
    if(!editArea) return;

    const editAreaContent = editArea.innerText;

    const form = document.createElement("form");
    form.id = "edit-form-" + element.id;
    form.setAttribute("method", "POST");
    form.setAttribute("action", "/news_comments/edit/" + element.id);

    const textarea = document.createElement("textarea");
    textarea.setAttribute("name", "comments_content");
    textarea.setAttribute("placeholder", "Edit your comment");
    textarea.classList = "comment-textarea";
    textarea.value = editAreaContent;

    const title = document.createElement("strong");
    title.innerText = "Your comment";
    title.classList = "d-block mb-2";

    form.appendChild(title);
    form.appendChild(textarea);
    
    editArea.parentNode.replaceChild(form, editArea);

    // Button:
    const buttonContainer = element.parentNode;

    const saveButton = document.createElement("button");
    saveButton.classList = "btn btn-success mx-md-3 me-3";
    saveButton.innerText = "Save";
    saveButton.id = "edit-save-" + element.id;

    saveButton.onclick = () => saveCommentEdit(textarea.value, editAreaContent, element.id);

    buttonContainer.insertBefore(saveButton, buttonContainer.firstChild);

    element.onclick = () => resetNodesEdit(editAreaContent, element.id);
    element.innerText = "Cancel";
}

function saveCommentEdit(comments_content, old_content, comments_id) {
    if(comments_content == old_content) 
        return resetNodesEdit(comments_content, comments_id);

    const data = {
        comments_content: comments_content
    }

    const formBody = constructFormBody(data);

    const editUrl = "/news_comments/edit/" + comments_id;

    fetch(editUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody
    })
    .then(async response => {
        response = await response.json();

        resetNodesEdit(response.comments_content, comments_id);
    });
}

function resetNodesEdit(comments_content, comments_id) {
    const paragraphEdit = document.createElement("p");
    paragraphEdit.innerText = comments_content;
    paragraphEdit.id = "edit-msg-" + comments_id;

    const form = document.getElementById("edit-form-" + comments_id);
    form.parentNode.replaceChild(paragraphEdit, form);

    document.getElementById("edit-save-" + comments_id).remove();

    const editBtn = document.getElementById(comments_id);
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editComment(editBtn);
}