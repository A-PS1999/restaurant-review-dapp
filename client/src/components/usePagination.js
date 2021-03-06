export default function usePagination(allReviews, perPage, page, setPage) {
	
	const maxPage = Math.ceil(allReviews.length / perPage);
	
	function pageData() {
		const start = (page - 1) * perPage;
		const end = start + perPage
		
		return allReviews.slice(start, end);
	}
	
	function nextPage() {
		setPage((page) => Math.min(page + 1, maxPage));
	}
	
	function prevPage() {
		setPage((page) => Math.max(page - 1, 1));
	}
	
	function jumpPage(page) {
		const pageNumber = Math.max(1, page);
		setPage((page) => Math.min(pageNumber, maxPage));
	}
	
	return { nextPage, prevPage, jumpPage, pageData, page, maxPage }
}