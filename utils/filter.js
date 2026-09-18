exports.searchRegex = (val) => {
    return { $regex: val, $options: "i" };
}