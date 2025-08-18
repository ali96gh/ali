document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dataForm');
    const tableBody = document.getElementById('tableBody');
    const printBtn = document.getElementById('printBtn');
    const cancelEditBtn = document.getElementById('cancelEdit');
    let records = JSON.parse(localStorage.getItem('firedEmployees')) || [];
    let editingId = null;

    // عرض البيانات في الجدول
    function renderTable() {
        tableBody.innerHTML = '';
        records.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.name}</td>
                <td>${record.motherName}</td>
                <td>${record.education}</td>
                <td>${record.reviewPlace}</td>
                <td>${record.department}</td>
                <td class="actions-column">
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${record.id}">تعديل</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${record.id}">حذف</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // إضافة معالج الأحداث لأزرار التعديل والحذف
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    // معالجة إرسال النموذج
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const record = {
            id: editingId || Date.now().toString(),
            name: document.getElementById('name').value,
            motherName: document.getElementById('motherName').value,
            education: document.getElementById('education').value,
            reviewPlace: document.getElementById('reviewPlace').value,
            department: document.getElementById('department').value
        };

        if (editingId) {
            // تحديث السجل الموجود
            const index = records.findIndex(r => r.id === editingId);
            records[index] = record;
            editingId = null;
            cancelEditBtn.style.display = 'none';
        } else {
            // إضافة سجل جديد
            records.push(record);
        }

        localStorage.setItem('firedEmployees', JSON.stringify(records));
        renderTable();
        form.reset();
    });

    // معالجة التعديل
    function handleEdit(e) {
        const id = e.target.getAttribute('data-id');
        const record = records.find(r => r.id === id);
        
        if (record) {
            document.getElementById('name').value = record.name;
            document.getElementById('motherName').value = record.motherName;
            document.getElementById('education').value = record.education;
            document.getElementById('reviewPlace').value = record.reviewPlace;
            document.getElementById('department').value = record.department;
            document.getElementById('recordId').value = record.id;
            
            editingId = id;
            cancelEditBtn.style.display = 'inline-block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // معالجة الحذف
    function handleDelete(e) {
        if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            const id = e.target.getAttribute('data-id');
            records = records.filter(r => r.id !== id);
            localStorage.setItem('firedEmployees', JSON.stringify(records));
            renderTable();
        }
    }

    // إلغاء التعديل
    cancelEditBtn.addEventListener('click', function() {
        form.reset();
        editingId = null;
        cancelEditBtn.style.display = 'none';
    });

    // طباعة الجدول
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // عرض البيانات عند تحميل الصفحة
    renderTable();
});
