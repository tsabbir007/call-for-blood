'use client'

import { useState, useEffect } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaginationDemo } from "@/components/table/pagination"
import ActionCell from './action-cell'
import AddUserDialog from './add-user-dialog'
import { RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Donor {
    id: string
    email: string
    isVerified: boolean
    role: string
    name: string
    image: string | null
    bloodGroup: string | null
    phoneNumber: string | null
    division: string | null
    district: string | null
    upazilla: string | null
    occupation: string | null
    age: string | null
    lastDonatedAt: Date | null
}

interface District {
    district: string
    coordinates: string
    upazilla: string[]
}

const columns: ColumnDef<Donor>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                <Avatar>
                    <AvatarImage src={row.original.image || undefined} />
                    <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{row.getValue("name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "age",
        header: "Age",
    },
    {
        accessorKey: "bloodGroup",
        header: "Blood Group",
    },
    {
        accessorKey: "lastDonatedAt",
        header: "Last Donated",
        cell: ({ row }) => row.getValue("lastDonatedAt") ? new Date(row.getValue("lastDonatedAt")).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) : 'N/A',
    },
    {
        accessorKey: "current_location",
        header: "Current location",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const lastDonated = row.original.lastDonatedAt ? new Date(row.original.lastDonatedAt) : null;
            const fourMonthsAgo = new Date()
            fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4)
            const isAvailable = lastDonated && lastDonated <= fourMonthsAgo
            return (
                <Badge variant={'outline'}
                    className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {isAvailable ? "Available" : "Unavailable"}
                </Badge>
            )
        },
    },
    {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const donor = row.original
            return (
                <ActionCell donor={donor} />
            )
        },
    }
]


export function DonorTable() {
    const [data, setData] = useState<Donor[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [divisionFilter, setDivisionFilter] = useState("")
    const [districtFilter, setDistrictFilter] = useState("")
    const [upazillaFilter, setUpazillaFilter] = useState("")
    const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all")
    const [isVerifiedFilter, setIsVerifiedFilter] = useState<"all" | "verified" | "unverified">("all")
    const [bloodGroupFilter, setBloodGroupFilter] = useState("")
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    const [divisions, setDivisions] = useState<string[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [upazillas, setUpazillas] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [count, setCount] = useState(0)
    const [previous, setPrevious] = useState<number | null>(null)
    const [next, setNext] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)

    const fetchDonors = async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (divisionFilter) params.append('division', divisionFilter !== 'all' ? divisionFilter : '')
        if (districtFilter) params.append('district', districtFilter !== 'all' ? districtFilter : '')
        if (upazillaFilter) params.append('upazilla', upazillaFilter !== 'all' ? upazillaFilter : '')
        if (availabilityFilter !== 'all') params.append('availability', availabilityFilter)
        if (isVerifiedFilter !== 'all') params.append('isVerified', isVerifiedFilter === 'verified' ? 'true' : 'false')
        if (bloodGroupFilter) params.append('bloodGroup', bloodGroupFilter !== 'all' ? bloodGroupFilter : '')
        if (globalFilter) params.append('search', globalFilter)
        params.append('page', page.toString())
        params.append('page_size', pageSize.toString())

        const response = await fetch(`/api/donors?${params.toString()}`)
        const data = await response.json()
        setData(data.donors)
        setCount(data.count)
        setPrevious(data.previous)
        setNext(data.next)
        setLoading(false)
    }

    const fetchDivisions = async () => {
        const response = await fetch('https://bdapis.com/api/v1.2/divisions')
        const data = await response.json()
        setDivisions(data.data.map((division: any) => division.division))
    }

    const fetchDistricts = async (division: string) => {
        if (division === 'all') {
            setDistricts([])
            setUpazillas([])
            return
        }
        const response = await fetch(`https://bdapis.com/api/v1.2/division/${division}`)
        const data = await response.json()
        setDistricts(data.data)
        setDistrictFilter('')
        setUpazillaFilter('')
    }

    useEffect(() => {
        fetchDonors()
        fetchDivisions()
    }, [divisionFilter, districtFilter, upazillaFilter, availabilityFilter, isVerifiedFilter, bloodGroupFilter, globalFilter, page, pageSize])

    useEffect(() => {
        if (divisionFilter) {
            fetchDistricts(divisionFilter)
        }
    }, [divisionFilter])

    useEffect(() => {
        if (districtFilter) {
            const selectedDistrict = districts.find(d => d.district === districtFilter)
            setUpazillas(selectedDistrict ? selectedDistrict.upazilla : [])
        } else {
            setUpazillas([])
        }
    }, [districtFilter, districts])

    useEffect(() => {
        // Fetch the current user's role and email
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/api/currentUser')
                const data = await response.json()
                setCurrentUserRole(data.role)
                setCurrentUserEmail(data.email)
            } catch (error) {
                console.error('Error fetching current user:', error)
            }
        }

        fetchCurrentUser()
    }, [])

    const canEditUsers = currentUserRole === 'ADMIN' || currentUserEmail === 'satsabbir11@gmail.com'

    const table = useReactTable({
        data,
        columns: canEditUsers ? columns : columns.filter(col => col.id !== 'actions'),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div id="donor-table" className="space-y-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold">Donor List</h2>
                <p className="text-base text-gray-500">Find and manage donors in your area.</p>
            </div>
            <div className="flex flex-wrap items-center justify-between">
                {/*<Input*/}
                {/*    placeholder="Search donors..."*/}
                {/*    value={globalFilter ?? ""}*/}
                {/*    onChange={(event) => setGlobalFilter(event.target.value)}*/}
                {/*    className="max-w-sm"*/}
                {/*/>*/}
                {canEditUsers && <AddUserDialog />}
            </div>
            <div className="flex flex-wrap mt-2 gap-2">
                <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by division" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All divisions</SelectItem>
                        {divisions.map((division) => (
                            <SelectItem key={division} value={division}>
                                {division}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by district" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All districts</SelectItem>
                        {districts.map((district) => (
                            <SelectItem key={district.district} value={district.district}>
                                {district.district}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={upazillaFilter} onValueChange={setUpazillaFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by upazilla" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All upazillas</SelectItem>
                        {upazillas.map((upazilla) => (
                            <SelectItem key={upazilla} value={upazilla}>
                                {upazilla}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={availabilityFilter}
                    onValueChange={(value) => setAvailabilityFilter(value as "all" | "available" | "unavailable")}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by availability" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                </Select>
                {canEditUsers && (
                    <Select value={isVerifiedFilter}
                        onValueChange={(value) => setIsVerifiedFilter(value as "all" | "verified" | "unverified")}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="unverified">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by blood group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All blood groups</SelectItem>
                        {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                                {group}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={() => {
                    setDivisionFilter("")
                    setDistrictFilter("")
                    setUpazillaFilter("")
                    setAvailabilityFilter("all")
                    setIsVerifiedFilter("all")
                    setBloodGroupFilter("")
                    setGlobalFilter("")
                }}>
                    Clear Filters
                </Button>
              
                <Button variant={"ghost"} onClick={fetchDonors}>
                    <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                </Button>

                <div className={`ms-auto`}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                {loading ? (
                    <div className="h-24 flex items-center justify-center">Loading...</div>
                ) : (
                    <Table className={`text-sm`}>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <PaginationDemo pageSize={pageSize} setPageSize={setPageSize} page={page} setPage={setPage}
                    totalItems={count} />
            </div>
        </div>
    )
}