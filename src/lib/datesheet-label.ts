/** Sentinel stored when exam applies to every branch (branch picker optional for now). */
export const ALL_BRANCHES_CODE = "ALL";

export function isAllBranchesEntry(branch: string | null | undefined, branches?: string[] | null) {
  if (!branch || branch === "-" || branch === ALL_BRANCHES_CODE) return true;
  if (branches?.length === 1 && (branches[0] === ALL_BRANCHES_CODE || branches[0] === "-")) return true;
  return false;
}

export function formatDatesheetBranches(branch: string, branches?: string[] | null): string {
  if (isAllBranchesEntry(branch, branches)) return "All branches";
  const list = branches?.length ? branches : [branch].filter(Boolean);
  if (list.length > 1) return `${list.join(", ")}`;
  return list[0] || "All branches";
}
