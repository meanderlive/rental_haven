import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ForgotPasswordModal } from "./forgot-password-modal";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  mobile: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "owner"], {
    required_error: "Please select your role",
  }),
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onToggleMode }: AuthModalProps) {
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, register, isLoginLoading, isRegisterLoading, loginError, registerError } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "user",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await login(data);
      if (result && result.user && result.token) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
        loginForm.reset();
      onClose();
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      const result = await register(data);
      if (result && result.user && result.token) {
      toast({
        title: "Account created!",
        description: "Welcome to PropertyHub! Your account has been created successfully.",
      });
        registerForm.reset();
      onClose();
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "Please try again with different information.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Sign in to your account' 
              : 'Join our property rental community'
            }
          </p>
        </DialogHeader>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...loginForm.register("email")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...loginForm.register("password")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <Checkbox 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="text-red-500 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-rental"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <Label>I am a...</Label>
              <RadioGroup
                value={registerForm.watch("role")}
                onValueChange={(value) => registerForm.setValue("role", value as "user" | "owner")}
                className="grid grid-cols-2 gap-3 mt-2"
                name="role"
              >
                <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="user" id="user" className="text-red-500 focus:ring-red-500" />
                  <Label htmlFor="user">Renter</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="owner" id="owner" className="text-red-500 focus:ring-red-500" />
                  <Label htmlFor="owner">Property Owner</Label>
                </div>
              </RadioGroup>
              {registerForm.formState.errors.role && (
                <p className="text-red-600 text-sm mt-1">
                  {registerForm.formState.errors.role.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
                <Input
                id="name"
                  type="text"
                placeholder="Enter your full name"
                {...registerForm.register("name")}
                  className="focus:ring-red-500 focus:border-red-500"
                />
              {registerForm.formState.errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="registerEmail">Email</Label>
              <Input
                id="registerEmail"
                type="email"
                placeholder="Enter your email"
                {...registerForm.register("email")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {registerForm.formState.errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                {...registerForm.register("mobile")}
                className="focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <Label htmlFor="registerPassword">Password</Label>
              <Input
                id="registerPassword"
                type="password"
                placeholder="Create a password"
                {...registerForm.register("password")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {registerForm.formState.errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full btn-rental"
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={onToggleMode}
              className="text-red-500 hover:text-red-600 font-medium ml-1"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </DialogContent>
      
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </Dialog>
  );
}
