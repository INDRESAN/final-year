import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, Shield, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/api/client";

interface User {
    username: string;
}

const EnrolledUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            // The API returns { users: ["name1", "name2"], total_count: 2 }
            if (res.data && Array.isArray(res.data.users)) {
                setUsers(res.data.users.map((username: string) => ({ username })));
            }
        } catch (error) {
            toast.error("Failed to fetch users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (username: string) => {
        if (!window.confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) {
            return;
        }

        try {
            setDeleting(username);
            const res = await api.delete(`/users/${username}`);
            if (res.data.success) {
                toast.success(`User ${username} deleted successfully`);
                setUsers(users.filter(u => u.username !== username));
            }
        } catch (error) {
            toast.error(`Failed to delete user ${username}`);
            console.error(error);
        } finally {
            setDeleting(null);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl justify-center items-center flex gap-3 font-bold tracking-tight mb-2">
                        <Users className="w-8 h-8 text-primary" />
                        Enrolled Users
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and view all users currently enrolled in the face recognition database.
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-2 text-sm bg-secondary/20">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    {users.length} Total Users
                </Badge>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>User Database</CardTitle>
                            <CardDescription>All authorized identities in the system.</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9 bg-background/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-12 flex justify-center items-center">
                            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            {searchQuery ? "No users match your search." : "No users enrolled yet."}
                        </div>
                    ) : (
                        <div className="rounded-md border border-border/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-secondary/30 text-muted-foreground uppercase border-b border-border/50">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">User Identity</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.username}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="border-b border-border/50 bg-background/30 hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    {user.username}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={deleting === user.username}
                                                        onClick={() => handleDelete(user.username)}
                                                        className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                                                    >
                                                        {deleting === user.username ? (
                                                            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Remove
                                                            </>
                                                        )}
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EnrolledUsersPage;
