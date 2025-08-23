function onClick() {
    const click = document.getElementById("button");
    const p = document.getElementById("p");
    let count = 0;
    click.addEventListener("click", () => {
        count += 1;
        p.innerHTML = `Count ${count}`;
    })
}
onClick();