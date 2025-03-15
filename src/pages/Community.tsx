
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { askOpenAI } from "@/lib/openai";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ThumbsUp, MessageCircle, Share2, Send, Filter, Search } from "lucide-react";

type Post = {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  liked: boolean;
};

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Alex Johnson",
      avatar: undefined,
      role: "Student"
    },
    content: "Just submitted my application for the STEM Innovation Grant! Really hoping to get funding for my renewable energy project. Has anyone here received this scholarship before?",
    likes: 24,
    comments: 5,
    timestamp: "2 hours ago",
    tags: ["STEM", "Scholarships"],
    liked: false
  },
  {
    id: "2",
    author: {
      name: "Tech Foundation",
      avatar: undefined,
      role: "Sponsor"
    },
    content: "We're excited to announce our new blockchain technology scholarship! This program will fund 10 students with projects focusing on decentralized applications. Applications open next week.",
    likes: 56,
    comments: 12,
    timestamp: "5 hours ago",
    tags: ["Blockchain", "Announcement"],
    liked: true
  },
  {
    id: "3",
    author: {
      name: "Jamie Williams",
      avatar: undefined,
      role: "Student"
    },
    content: "I just received my first scholarship payment through the smart contract! The process was so smooth and transparent. Loving how EduLink makes everything easier to track.",
    image: "https://picsum.photos/seed/scholarship/600/400",
    likes: 37,
    comments: 8,
    timestamp: "1 day ago",
    tags: ["Success", "SmartContracts"],
    liked: false
  }
];

const Community = () => {
  const { user } = useWallet();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newLiked = !post.liked;
          return {
            ...post,
            liked: newLiked,
            likes: newLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };
  
  const submitPost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPostObj: Post = {
        id: Date.now().toString(),
        author: {
          name: user?.name || "Anonymous",
          avatar: undefined,
          role: user?.type === "sponsor" ? "Sponsor" : "Student"
        },
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: "Just now",
        tags: ["New"],
        liked: false
      };
      
      setPosts(prev => [newPostObj, ...prev]);
      setNewPost("");
      
      toast({
        title: "Post published",
        description: "Your post has been published to the community",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish your post. Please try again.",
      });
    } finally {
      setIsPosting(false);
    }
  };
  
  const getAISuggestion = async () => {
    if (isLoadingSuggestion) return;
    
    setIsLoadingSuggestion(true);
    try {
      // Prepare system prompt
      const systemPrompt = 
        "You are an AI assistant for EduChain, a blockchain-based scholarship platform. " +
        "Help the user improve their post for the community forum. Make the post more engaging, " +
        "add relevant hashtags, and ensure it follows community guidelines. " +
        "Keep your suggestions brief, helpful, and positive.";
      
      // Get suggestion from OpenAI
      const suggestion = await askOpenAI(
        "sk-demo123", // This should be replaced with a proper API key
        systemPrompt,
        `Please help me improve this community post: "${newPost}"`,
        { model: "gpt-3.5-turbo" }
      );
      
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestions. Please try again later."
      });
    } finally {
      setIsLoadingSuggestion(false);
    }
  };
  
  const applySuggestion = () => {
    if (aiSuggestion) {
      setNewPost(aiSuggestion);
      setAiSuggestion("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground mt-1">
          Connect with students and sponsors in the EduLink community
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Share updates, questions, or celebrate achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px]"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              
              {aiSuggestion && (
                <Card className="mt-4 bg-muted/50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">AI Suggestion</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">{aiSuggestion}</p>
                  </CardContent>
                  <CardFooter className="py-2">
                    <Button size="sm" variant="outline" onClick={applySuggestion}>
                      Apply Suggestion
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={getAISuggestion}
                disabled={!newPost.trim() || isLoadingSuggestion}
              >
                {isLoadingSuggestion ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Getting suggestions...
                  </>
                ) : (
                  <>Get AI suggestions</>
                )}
              </Button>
              <Button 
                onClick={submitPost}
                disabled={!newPost.trim() || isPosting}
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>Post</>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="space-y-4 mt-2">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          {post.author.avatar && <AvatarImage src={post.author.avatar} />}
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{post.author.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{post.author.role}</Badge>
                            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="whitespace-pre-line">{post.content}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post image" 
                        className="rounded-md mt-3 w-full object-cover max-h-96" 
                      />
                    )}
                    <div className="flex gap-2 mt-3">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-3">
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={post.liked ? "text-primary" : ""}
                        onClick={() => handleLike(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="students" className="space-y-4 mt-2">
              {posts
                .filter(post => post.author.role === "Student")
                .map(post => (
                  <Card key={post.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            {post.author.avatar && <AvatarImage src={post.author.avatar} />}
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{post.author.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{post.author.role}</Badge>
                              <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="whitespace-pre-line">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post image" 
                          className="rounded-md mt-3 w-full object-cover max-h-96" 
                        />
                      )}
                      <div className="flex gap-2 mt-3">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-3">
                      <div className="flex gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={post.liked ? "text-primary" : ""}
                          onClick={() => handleLike(post.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </TabsContent>
            
            <TabsContent value="sponsors" className="space-y-4 mt-2">
              {posts
                .filter(post => post.author.role === "Sponsor")
                .map(post => (
                  <Card key={post.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            {post.author.avatar && <AvatarImage src={post.author.avatar} />}
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{post.author.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{post.author.role}</Badge>
                              <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="whitespace-pre-line">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post image" 
                          className="rounded-md mt-3 w-full object-cover max-h-96" 
                        />
                      )}
                      <div className="flex gap-2 mt-3">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-3">
                      <div className="flex gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={post.liked ? "text-primary" : ""}
                          onClick={() => handleLike(post.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>
                  Welcome to the EduLink community! To ensure a positive experience for all members, please follow these guidelines:
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Be respectful and supportive of other members</li>
                  <li>Stay on topic with discussions about scholarships and education</li>
                  <li>Do not share personal financial information</li>
                  <li>Respect privacy and confidentiality</li>
                  <li>No spam, solicitation, or promotional content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className="mr-2 mb-2">#ScholarshipSuccess</Badge>
                <Badge className="mr-2 mb-2">#BlockchainEdu</Badge>
                <Badge className="mr-2 mb-2">#STEMopportunities</Badge>
                <Badge className="mr-2 mb-2">#DeFiLearning</Badge>
                <Badge className="mr-2 mb-2">#EducationDAO</Badge>
                <Badge className="mr-2 mb-2">#CryptoScholars</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] overflow-y-auto p-4 border-b">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-2 rounded-md max-w-[80%]">
                      <p className="text-xs font-medium">Sarah</p>
                      <p className="text-sm">Has anyone applied for the Arts scholarship yet?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <div className="bg-primary text-primary-foreground p-2 rounded-md max-w-[80%]">
                      <p className="text-sm">Yes! I just submitted mine yesterday.</p>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-2 rounded-md max-w-[80%]">
                      <p className="text-xs font-medium">Michael</p>
                      <p className="text-sm">The deadline is next week, right?</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex gap-2">
                  <Input placeholder="Type a message" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
