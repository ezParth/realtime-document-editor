const DiffMatchPatch = require("diff-match-patch");
const dmp = new DiffMatchPatch();

// const ans = dmp.patch_make("The diffs array contain the differences between the two strings. Each element in this array is itself an array, where:", "The diffs array contains the differences between the two strings. Each element in this array is itself an array, where: The first element indicates the type of operation.")
// console.log(ans);
// let hello = "hello world"
// console.log(ans[0].diffs[0])
// console.log(ans[0].diffs[1])
// console.log(ans[1].diffs[0])
// console.log(ans[1].diffs[1])
// const ans2 = dmp.patch_apply(ans,"The diffs array contain the differences between the two strings. Each element in this array is itself an array, where:")
// const ans3 = dmp.patch_fromText(hello.patch)
// console.log(ans3);
// console.log(ans2);

const newText = "A quick brown fox jumps over the lazy dog.";
const originalText = "The quick brown fox jumps over the lazy dog.";

const patch = dmp.patch_make(originalText, newText)
const patchText = dmp.patch_toText(patch);
console.log(patchText);