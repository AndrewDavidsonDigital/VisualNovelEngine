export function innerClickEvent(event: MouseEvent){
  const bublealbeEvent = new CustomEvent("inner-click", event);
  document.dispatchEvent(bublealbeEvent);
}