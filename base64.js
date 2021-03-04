class Base64Transformer {
  constructor() {
    this.extra = "";
  }

  transform(chunk, controller) {
    function toBinary(chunk) {
      const codeUnits = new Uint8Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        codeUnits[i] = chunk.charCodeAt(i);
      }
      return codeUnits;
    }
    console.log("transform");
    chunk = (new TextDecoder()).decode(chunk)
    chunk = this.extra + chunk.replace(/(\r\n|\n|\r)/gm, '');

    // 4 characters represent 3 bytes, so we can only decode in groups of 4 chars
    const remaining = chunk.length % 4;

    // Store the extra chars for later
    this.extra = chunk.slice(chunk.length - remaining);
    chunk = chunk.slice(0, chunk.length - remaining);
    controller.enqueue(toBinary(atob(chunk)));
  }

  flush(controller) {
    if (this.extra.length > 0) {
      console.error("data left: '%o'", this.extra);
    }
  }
}

function save(url, file){
  const fileStream = streamSaver.createWriteStream(file)

  fetch(url)
  .then(res => res.body)
  .then(stream => stream.pipeThrough(new DecompressionStream('gzip')))
  .then(stream => stream.pipeThrough(new TransformStream(new Base64Transformer())))
  .then(stream => stream.pipeTo(fileStream))
  .then(() => console.log('done writing'))
}
