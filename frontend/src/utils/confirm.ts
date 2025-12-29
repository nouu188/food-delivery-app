import { useConfirmStore } from "@/store/useConfirmStore";
import type { ConfirmPayload } from "@/store/useConfirmStore";

export const confirm = (payload: ConfirmPayload) => {
    return useConfirmStore.getState().open(payload);
};
