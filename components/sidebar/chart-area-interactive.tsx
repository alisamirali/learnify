"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "An interactive area chart";

const dummyData = [
  {
    date: "2024-06-01",
    enrollments: 100,
  },
  {
    date: "2024-06-02",
    enrollments: 120,
  },
  {
    date: "2024-06-03",
    enrollments: 150,
  },
  {
    date: "2024-06-04",
    enrollments: 130,
  },
  {
    date: "2024-06-05",
    enrollments: 170,
  },
  {
    date: "2024-06-06",
    enrollments: 200,
  },
  {
    date: "2024-06-07",
    enrollments: 180,
  },
  {
    date: "2024-06-08",
    enrollments: 220,
  },
  {
    date: "2024-06-09",
    enrollments: 240,
  },
  {
    date: "2024-06-10",
    enrollments: 260,
  },
  {
    date: "2024-06-11",
    enrollments: 280,
  },
  {
    date: "2024-06-12",
    enrollments: 300,
  },
  {
    date: "2024-06-13",
    enrollments: 320,
  },
  {
    date: "2024-06-14",
    enrollments: 340,
  },
  {
    date: "2024-06-15",
    enrollments: 360,
  },
  {
    date: "2024-06-16",
    enrollments: 380,
  },
  {
    date: "2024-06-17",
    enrollments: 400,
  },
  {
    date: "2024-06-18",
    enrollments: 420,
  },
  {
    date: "2024-06-19",
    enrollments: 440,
  },
  {
    date: "2024-06-20",
    enrollments: 460,
  },
  {
    date: "2024-06-21",
    enrollments: 480,
  },
  {
    date: "2024-06-22",
    enrollments: 500,
  },
  {
    date: "2024-06-23",
    enrollments: 520,
  },
  {
    date: "2024-06-24",
    enrollments: 540,
  },
  {
    date: "2024-06-25",
    enrollments: 560,
  },
  {
    date: "2024-06-26",
    enrollments: 580,
  },
  {
    date: "2024-06-27",
    enrollments: 600,
  },
  {
    date: "2024-06-28",
    enrollments: 620,
  },
  {
    date: "2024-06-29",
    enrollments: 640,
  },
  {
    date: "2024-06-30",
    enrollments: 660,
  },
];

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ChartAreaInteractiveProps = {
  data: {
    date: string;
    enrollments: number;
  }[];
};

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollments = useMemo(() => {
    return data.reduce((sum, entry) => sum + entry.enrollments, 0);
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total enrollments in the last 30 days: {totalEnrollments}
          </span>

          <span className="@[540px]/card:hidden">
            Last 30 days: {totalEnrollments}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);

                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
