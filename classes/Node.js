// will node JS even allow me to do this or will it literally shit itself
// this is a XenForo Node


// unfinished!!!!!!!!!!!!!!!
export class Node {
  
  update() {
    if (!this.is_existing)
      console.error("Cannot update Node that isn't existing.")
  }
  
  create() {
    // don't allow creation of new node if the object is a reference to an existing node.
    if (this.is_existing)
      console.error("Cannot create Node from existing Node.")
  }
  
  constructor(client,id) {
    if (id != undefined) {
      this.is_existing = true;
    }else{
      this.is_existing = false;
    }
    this.client = client;
  }
}
