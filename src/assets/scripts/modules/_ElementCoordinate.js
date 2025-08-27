export default class ElementCoordinate {
  constructor(element) {
    this.rect = element.getBoundingClientRect();
    this.x = this.rect.left + window.pageXOffset;
    this.y = this.rect.top + window.pageYOffset;
  }
}
