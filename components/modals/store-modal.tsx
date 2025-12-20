'use client'

import * as z from 'zod'

import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "../ui/modal"
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
    name: z.string().min(1),
});


const onSubmit = async(values: z.infer<typeof formSchema>) => {
    // TODO: Buat Toko
    console.log(values)
}
export const StoreModal = () => {
    const storeModal = useStoreModal();
    
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
    }
})
    return (
        <Modal
        title="Buat Store"
        description="Tambahkan Store Untuk Membuat Produk Dan Kategori"
        isOpen= {storeModal.isOpen}
        onClose= {storeModal.onClose}
        >
         <div>
            <div>
                <Form {...form}>
                <form>
                    <FormField 
                    control={form.control}
                    name='name'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                placeholder='Nama Toko'
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} 
                    />
                    <div>
                        <Button
                        
                        >Cancel</Button>
                    </div>
                </form>
                </Form>
            </div>
         </div>
        </Modal>
    )
}