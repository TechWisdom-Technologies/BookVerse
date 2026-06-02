async function main() {
  const res = await fetch('http://localhost:3000/api/search?q=adven&limit=5');
  const data = await res.json();
  data.results.forEach((r: any) => {
    console.log(`[${r._type}] (Score: ${r.promotionScore || 0}) ${r.title || r.username}`);
  });
}
main();
