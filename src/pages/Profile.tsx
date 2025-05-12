import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PickerDate } from '@/components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

const initialUser = {
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
    email: 'john@mail.com',
    phone: '+1 234 567 890',
    address: '123 Main St, Springfield, USA',
    gender: 'male',
    dob: '1990-01-01',
    insurance: 'Health Insurance',
};

const Profile = () => {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (field: string, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        setIsEditing(false);
        // TODO: persist changes
        console.log('Saved user:', user);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            handleChange('image', url);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="space-y-6 my-2.5">
                <div className="relative w-24 h-24 mx-auto">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={user.image}
                            className={isEditing ? 'filter blur-sm' : ''}
                        />
                        <AvatarFallback>
                            {user?.name?.[0] ?? 'U'}
                        </AvatarFallback>
                    </Avatar>

                    {isEditing && (
                        <>
                            <label
                                htmlFor="image-upload"
                                className="absolute inset-0 flex items-center justify-center bg-[rgb(0,0,0,0.4)]  bg-opacity-50 rounded-full"
                            >
                                <Camera className="w-6 h-6 text-white cursor-pointer" />
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageUpload}
                            />
                        </>
                    )}
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                </div>

                <div className="grid gap-4">
                    <div className="flex flex-col">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={user.email}
                            readOnly={!isEditing}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={user.phone}
                            readOnly={!isEditing}
                            onChange={(e) =>
                                handleChange('phone', e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={user.address}
                            readOnly={!isEditing}
                            onChange={(e) =>
                                handleChange('address', e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                            id="gender"
                            value={user.gender}
                            readOnly={!isEditing}
                            onChange={(e) =>
                                handleChange('gender', e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="insurance">Insurance</Label>
                        <Input
                            id="insurance"
                            value={user.insurance}
                            readOnly={!isEditing}
                            onChange={(e) =>
                                handleChange('insurance', e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <PickerDate buttonClassName="w-full" />
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button onClick={handleEdit} disabled={isEditing}>
                        Edit
                    </Button>
                    <Button onClick={handleSave} disabled={!isEditing}>
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Profile;
