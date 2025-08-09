
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateStudyScheduleAction } from './actions';

const formSchema = z.object({
  examDate: z.date({
    required_error: 'An exam date is required.',
  }),
  studyGoals: z.string().min(10, 'Please provide more details on your study goals (at least 10 characters).'),
  weeklyStudyHours: z.coerce.number().min(1, 'You must study at least 1 hour a week.').max(100, "Weekly hours can't exceed 100."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SchedulePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyGoals: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSchedule(null);
    try {
      const result = await generateStudyScheduleAction({
        examDate: format(values.examDate, 'yyyy-MM-dd'),
        studyGoals: values.studyGoals,
        weeklyStudyHours: values.weeklyStudyHours,
        quizHistoryData: "Math: 85%, Science: 72%, History: 91%",
      });

      if (result.studySchedule && !result.studySchedule.startsWith('Error:')) {
        setSchedule(result.studySchedule);
        toast({ title: "Success!", description: "Your study schedule has been generated." });
      } else {
        throw new Error(result.studySchedule || 'Failed to generate schedule.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Study Schedule Generator</h1>
          <p className="text-muted-foreground">Fill in the details below to get your personalized study plan.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Your Study Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="examDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Exam Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studyGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Goals / Topics</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Master calculus, understand the French Revolution, learn cellular biology..." {...field} rows={4} />
                        </FormControl>
                        <FormDescription>Be as specific as possible for a better schedule.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weeklyStudyHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Study Hours</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Schedule
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col min-h-[500px]">
            <CardHeader>
              <CardTitle>Your Generated Schedule</CardTitle>
              <CardDescription>Your personalized study plan will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {schedule && (
                 <div className="prose-sm prose-invert max-w-none rounded-md border bg-muted p-4 h-full overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{schedule}</pre>
                </div>
              )}
              {!isLoading && !schedule && (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Your schedule is waiting to be created.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
