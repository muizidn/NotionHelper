export default function createDraggableContainer(id: string, container: HTMLElement): HTMLDivElement {
    const me = document.createElement("div");
    me.id = id;
    me.classList.add('root-component-honyaku-draggable')
    container.appendChild(me);

    // Load initial position from localStorage
    const savedPositionJSON = localStorage.getItem("draggableElementPosition");
    const savedPosition = savedPositionJSON ? JSON.parse(savedPositionJSON) : null;
    me.style.right = '10px';
    if (savedPosition) {
        me.style.top = savedPosition.y;
    } else {
        me.style.bottom = '10px';
    }

    let isDragging = false;
    let offsetY = 0;

    me.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetY = e.clientY - me.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const y = e.clientY - offsetY;
            me.style.right = `10px`;
            me.style.top = `${y}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;

        // Save the current position in localStorage
        const currentPosition = {
            x: me.style.left,
            y: me.style.top,
        };
        localStorage.setItem("draggableElementPosition", JSON.stringify(currentPosition));
    });
    return me;
}