

export function createElement<T extends HTMLElement>(
    tag: keyof HTMLElementTagNameMap,
    className?: string,
    content?: string
): T {
    const e = window.document.createElement(tag) as T;
    className = className || "";
    content = content || "";

    e.className = className;
    
    if (content !== undefined) e.textContent = content;
    return e
}


export function clearNode(node: HTMLElement) {
    while (node.firstChild) node.removeChild(node.firstChild)
}

export function toggleClass<E extends HTMLElement>(
    el: E | E[],
    className: string
): void {
    if (el instanceof Array) {
        for (let i = 0; i < el.length; i++) toggleClass(el[i], className)
    } else {
        el.classList.toggle(className)
    }
}