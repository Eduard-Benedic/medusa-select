

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