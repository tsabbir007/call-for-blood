import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {SelectItemText} from "@radix-ui/react-select";

interface PaginationDemoProps {
    pageSize: number;
    page: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    totalItems: number;
}

export function PaginationDemo(props: PaginationDemoProps) {
    const {pageSize, page, setPage, setPageSize, totalItems} = props;
    const totalPages = Math.ceil(totalItems / pageSize);

    const pageSizeOptions = [20, 50, 100, 200];

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink isActive={i === page} onClick={() => handlePageChange(i)}>{i}</PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <div className={`flex items-center`}>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(page - 1)}/>
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(page + 1)}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))} defaultValue={"20"}>
                <SelectTrigger className="w-[60px]">
                    <SelectValue placeholder="Select page size"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Page Size</SelectLabel>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}