 
export function innerInteractionEvent(event: MouseEvent | KeyboardEvent){
  const bubleableEvent = new CustomEvent("inner-click", event);
  document.dispatchEvent(bubleableEvent);
}