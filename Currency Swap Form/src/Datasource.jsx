class Datasource {
  constructor(url) {
    this.url = url;
  }

  async getPrices() {
    const datasource = await fetch(this.url);
    if (!datasource.ok) {
      console.error("No datasource");
    }
    const test = await datasource.json();
    console.log("TEST", test);

    return test;
  }
}

export default Datasource;
