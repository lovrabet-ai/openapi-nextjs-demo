"use server";

import { createServerClient } from "@/lib/sdk-client";
import { revalidatePath } from "next/cache";

/**
 * 创建新供应商记录
 */
export async function createRecord(formData: FormData) {
  try {
    const client = createServerClient();
    // 使用 Suppliers 模型
    const model = client.getModel("Suppliers");

    // 从 FormData 中提取数据
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      // 跳过空值
      if (value && value !== "") {
        // is_deleted 字段需要转换为数字类型
        if (key === "is_deleted") {
          data[key] = Number(value);
        } else {
          data[key] = value;
        }
      }
    });

    console.log("Creating record with data:", data);

    // 调用 create 接口
    const result = await model.create(data);

    console.log("Create result:", result);

    // 重新验证页面，刷新数据
    revalidatePath("/scenario1-ssr");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to create record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建失败",
    };
  }
}

/**
 * 更新供应商记录
 */
export async function updateRecord(id: string | number, formData: FormData) {
  try {
    const client = createServerClient();
    // 使用 Suppliers 模型
    const model = client.getModel("Suppliers");

    // 从 FormData 中提取数据
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      // 跳过 id 和空值
      if (key !== "id" && value && value !== "") {
        // is_deleted 字段需要转换为数字类型
        if (key === "is_deleted") {
          data[key] = Number(value);
        } else {
          data[key] = value;
        }
      }
    });

    console.log(`Updating record ${id} with data:`, data);

    // 调用 update 接口
    const result = await model.update(id, data);

    console.log("Update result:", result);

    // 重新验证页面，刷新数据
    revalidatePath("/scenario1-ssr");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to update record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新失败",
    };
  }
}
