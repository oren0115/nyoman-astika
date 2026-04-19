import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, Article, Globe, PencilSimple, Plus, Briefcase, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { getProjects } from "@/lib/services/project.service";
import { getPosts } from "@/lib/services/post.service";
import { getExperiences } from "@/lib/services/experience.service";
import { getUnreadCount } from "@/lib/services/contact.service";
import { getSession } from "@/lib/auth";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboardPage() {
  const session = await getSession();

  const [projectsData, postsData, experiences, unreadMessages] = await Promise.all([
    getProjects({ limit: 100 }).catch(() => ({ projects: [], total: 0 })),
    getPosts({ limit: 100 }).catch(() => ({ posts: [], total: 0 })),
    getExperiences().catch(() => []),
    getUnreadCount().catch(() => 0),
  ]);

  const { projects, total: totalProjects } = projectsData;
  const { posts, total: totalPosts } = postsData;

  const publishedProjects = projects.filter((p) => p.status === "PUBLISHED").length;
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").length;

  const recentProjects = projects.slice(0, 5);
  const recentPosts = posts.slice(0, 5);

  return (
    <div>
      <AdminHeader
        title={`Welcome back, ${session?.name ?? "Admin"}`}
        description="Here's an overview of your portfolio content."
        actions={
          <div className="flex gap-2">
            <Button asChild size="xs" variant="outline">
              <Link href="/admin/projects/new">
                <Plus /> Project
              </Link>
            </Button>
            <Button asChild size="xs">
              <Link href="/admin/posts/new">
                <Plus /> Post
              </Link>
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Projects"
            value={totalProjects}
            description={`${publishedProjects} published`}
            icon={FolderOpen}
          />
          <StatsCard
            title="Total Posts"
            value={totalPosts}
            description={`${publishedPosts} published`}
            icon={Article}
          />
          <StatsCard
            title="Experience"
            value={experiences.length}
            description={`${experiences.filter((e) => e.current).length} current`}
            icon={Briefcase}
          />
          <StatsCard
            title="Messages"
            value={unreadMessages}
            description="Unread in inbox"
            icon={EnvelopeSimple}
          />
        </div>

        {/* Recent content */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Recent Projects</CardTitle>
              <Button asChild variant="ghost" size="xs">
                <Link href="/admin/projects">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No projects yet.{" "}
                  <Link href="/admin/projects/new" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              ) : (
                <div className="space-y-0.5">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-none px-2 py-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(project.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge
                          variant={
                            project.status === "PUBLISHED"
                              ? "default"
                              : project.status === "DRAFT"
                                ? "outline"
                                : "muted"
                          }
                          className="text-xs"
                        >
                          {project.status.toLowerCase()}
                        </Badge>
                        <Button asChild variant="ghost" size="icon-xs">
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <PencilSimple />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Recent Posts</CardTitle>
              <Button asChild variant="ghost" size="xs">
                <Link href="/admin/posts">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentPosts.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No posts yet.{" "}
                  <Link href="/admin/posts/new" className="text-primary hover:underline">
                    Write one
                  </Link>
                </p>
              ) : (
                <div className="space-y-0.5">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between rounded-none px-2 py-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(post.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge
                          variant={
                            post.status === "PUBLISHED"
                              ? "default"
                              : post.status === "DRAFT"
                                ? "outline"
                                : "muted"
                          }
                          className="text-xs"
                        >
                          {post.status.toLowerCase()}
                        </Badge>
                        <Button asChild variant="ghost" size="icon-xs">
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <PencilSimple />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
